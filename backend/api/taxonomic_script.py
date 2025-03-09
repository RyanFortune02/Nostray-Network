"""
Taxonomic Data Processing Script

This module processes taxonomic data from the Catalogue of Life (TextTree
format) found at https://www.catalogueoflife.org/data/download and generates:

1. A hierarchical taxonomy structure (taxonomic_hierarchy.py)
2. Django TextChoice classes for each taxonomic rank (taxonomic_classes.py)
"""

from typing import Optional

RANKS = ["domain", "kingdom", "phylum", "class", "order", "family", "genus"]


def extract_taxon_name(text: str) -> Optional[str]:
    """
    Extract taxon name from text, stopping at either:
    - First capital letter after first char (exclusive)
    - First non-latin/non-whitespace character (exclusive)
    """
    # Find position of first Latin character
    latin_chars = [index for index, char in enumerate(text) if char.isalpha()]

    # Require at least one Latin character
    if not latin_chars:
        return None

    # Find position of first capital letter after first Latin character
    capitals = [
        index
        for index, char in enumerate(text)
        if char.isupper() and index > latin_chars[0]
    ]

    # Find position of first non-latin/non-whitespace character after first Latin character
    non_latin = [
        index
        for index, char in enumerate(text)
        if not (char.isalpha() or char.isspace()) and index > latin_chars[0]
    ]

    # Use the earliest stopping point (capital letter or non-latin char)
    if capitals and non_latin:
        end_idx = min(capitals[0], non_latin[0])
    elif capitals:
        end_idx = capitals[0]
    elif non_latin:
        end_idx = non_latin[0]
    else:
        end_idx = len(text)

    substring = text[latin_chars[0] : end_idx].strip()
    filtered_chars = "".join(
        char for char in substring if char.isalpha() or char.isspace()
    )

    if not filtered_chars:
        return None

    # Return title case with whitespace stripped
    return (filtered_chars[0].upper() + filtered_chars[1:].lower()).strip()


def close_pending_braces(pending_braces, next_rank, hierarchy_file):
    """
    Close braces for ranks that are complete based on the next rank.
    """
    while pending_braces:
        brace_indent, brace_rank = pending_braces[-1]
        if not next_rank or RANKS.index(next_rank) <= RANKS.index(brace_rank):
            pending_braces.pop()
            comma_needed = next_rank == brace_rank
            hierarchy_file.write(
                "    " * brace_indent + ("}" + (",\n" if comma_needed else "\n"))
            )
        else:
            break


def write_taxon_entry(taxon, current_rank, indent_levels, classes, hierarchy_file):
    """
    Write a taxon entry to the output file and update the enum classes.
    """
    indent = "    " * indent_levels[current_rank]
    hierarchy_file.write(f'{indent}"{taxon}"')

    # Add to enum class
    enum_name = taxon.upper().replace(" ", "_")
    enum_string = f'    {enum_name} = "{taxon}"'
    if enum_string not in classes[current_rank]:
        classes[current_rank].append(enum_string)


def write_taxonomic_classes(classes, class_file, input_file):
    """
    Write the taxonomic enum classes to a separate file.
    """
    class_file.write("# This file was generated by taxonomic_script.py.\n")
    class_file.write(
        f"# Input file: {[substring.split('/') for substring in input_file.split('\\')][-1][-1]}\n"
    )
    class_file.write("# Edit with caution.\n\n\n")
    class_file.write("from django.db import models\n\n\n")
    for rank in classes.keys():
        class_file.write("\n".join(classes[rank]) + "\n\n")


def process_taxonomic_file(
    input_file: str,
    hierarchy_file: str,
    class_file: str,
    target_path: Optional[str] = None,
) -> None:
    indent_levels = {rank: i + 2 for i, rank in enumerate(RANKS)}
    classes = {}
    for rank in RANKS:
        classes[rank] = []
        classes[rank].append(
            f"class eTaxonomic{rank.capitalize()}(models.TextChoices):"
        )
        classes[rank].append('    OTHER = "Other"')
        classes[rank].append('    MISSING_DATA = "Missing Data"')

    # Parse target path if provided
    target_levels = None
    found_targets = {}  # Track targets found at each rank
    current_rank_status = {}  # Track if we're in a target branch for each rank
    lowest_target_rank = None  # Track lowest rank that has targets

    if target_path:
        # Parse into dictionary of rank: [values]
        target_levels = {}
        for level in target_path.split("|"):
            rank, values = level.split(":")
            rank = rank.lower()
            target_levels[rank] = set(values.split(","))
            found_targets[rank] = set()
            current_rank_status[rank] = False

        # Find lowest target rank
        lowest_target_rank = max(
            (RANKS.index(rank_name) for rank_name in target_levels.keys()), default=None
        )

    def get_next_valid_rank(line_index: int) -> Optional[str]:
        """Helper function to find the next valid rank."""
        while line_index < len(lines):
            next_line = lines[line_index].strip()
            if not next_line or next_line.startswith("="):
                line_index += 1
                continue

            try:
                _, rank = next_line.rsplit("[", 1)
                rank = rank.replace("]", "").strip()
                if rank in RANKS:
                    return rank
                line_index += 1
            except ValueError:
                line_index += 1
                continue

        return None

    with open(input_file, "r", encoding="utf-8") as input_handle, open(
        hierarchy_file, "w", encoding="utf-8"
    ) as hierarchy_handle, open(class_file, "w", encoding="utf-8") as class_handle:
        hierarchy_handle.write("# This file was generated by taxonomic_script.py.\n")
        hierarchy_handle.write(
            f"# Input file: {[substring.split('/') for substring in input_file.split('\\')][-1][-1]}\n"
        )
        hierarchy_handle.write("# Edit with caution.\n\n\n")
        hierarchy_handle.write("class TaxonomicHierarchy():\n")
        hierarchy_handle.write("    TAXONOMIC_HIERARCHY = {\n")
        lines = input_handle.readlines()
        line_index = 0
        pending_closing_braces = []
        last_rank_index = -1

        while line_index < len(lines):
            line = lines[line_index].strip()
            if not line or line.startswith("="):
                line_index += 1
                continue

            try:
                # Extract rank and taxon name
                parts = line.rsplit("[", 1)
                if len(parts) != 2:
                    line_index += 1
                    continue

                taxon = extract_taxon_name(parts[0].strip())
                if taxon is None:
                    print(f"Skipping invalid taxon name: {parts[0].strip()}")
                    print(f"Line: {line}")
                    line_index += 1
                    continue

                # Stop processing if we hit "Viruses"
                if taxon == "Viruses":
                    # Write all pending closing braces
                    close_pending_braces(pending_closing_braces, None, hierarchy_handle)
                    # Write final closing brace
                    hierarchy_handle.write("    }\n")
                    write_taxonomic_classes(classes, class_handle, input_file)
                    return

                current_rank = parts[1].replace("]", "").strip()
                if current_rank not in RANKS:
                    line_index += 1
                    continue

                if target_levels:
                    current_rank_index = RANKS.index(current_rank)

                    # Check if we're at a target rank
                    if current_rank in target_levels:
                        # Verify all previous rank targets are met
                        prev_ranks = [
                            rank_name
                            for rank_name in target_levels.keys()
                            if RANKS.index(rank_name) < current_rank_index
                        ]
                        if not all(
                            len(found_targets[rank_name])
                            == len(target_levels[rank_name])
                            for rank_name in prev_ranks
                        ):
                            line_index += 1
                            continue

                        if taxon in target_levels[current_rank]:
                            # Found a target at this rank
                            found_targets[current_rank].add(taxon)
                            current_rank_status[current_rank] = True
                        else:
                            # Not a target at this rank
                            current_rank_status[current_rank] = False
                            # Skip if we're at or above lowest target rank
                            if current_rank_index <= lowest_target_rank:
                                line_index += 1
                                continue

                    # Skip if either:
                    # 1. Haven't found any targets yet
                    # 2. At or above lowest target rank and not a target
                    # 3. Below a rank that isn't a target
                    if (
                        not any(found_targets.values())
                        or (
                            current_rank_index <= lowest_target_rank
                            and current_rank in target_levels
                            and not current_rank_status[current_rank]
                        )
                        or any(
                            not current_rank_status.get(RANKS[rank_index], False)
                            for rank_index in range(current_rank_index)
                            if RANKS[rank_index] in target_levels
                        )
                    ):
                        line_index += 1
                        continue

                current_rank_index = RANKS.index(current_rank)

                # Handle missing ranks
                if last_rank_index != -1 and current_rank_index > last_rank_index + 1:
                    for missing_rank_index in range(
                        last_rank_index + 1, current_rank_index
                    ):
                        missing_rank = RANKS[missing_rank_index]
                        indent = "    " * indent_levels[missing_rank]
                        hierarchy_handle.write(f'{indent}"MISSING_DATA": {{\n')
                        pending_closing_braces.append(
                            (indent_levels[missing_rank], missing_rank)
                        )

                write_taxon_entry(
                    taxon, current_rank, indent_levels, classes, hierarchy_handle
                )

                next_valid_rank = get_next_valid_rank(line_index + 1)

                if current_rank == "genus":
                    # Treat genus as a string instead of a new dictionary
                    if next_valid_rank == "genus":
                        hierarchy_handle.write(",\n")
                    else:
                        hierarchy_handle.write("\n")
                        close_pending_braces(
                            pending_closing_braces, next_valid_rank, hierarchy_handle
                        )
                else:
                    # Everything else is a new dictionary
                    hierarchy_handle.write(": {\n")
                    pending_closing_braces.append(
                        (indent_levels[current_rank], current_rank)
                    )
                    close_pending_braces(
                        pending_closing_braces, next_valid_rank, hierarchy_handle
                    )

                last_rank_index = current_rank_index
                line_index += 1

            except ValueError as error:
                print(f"Skipping invalid line: {line}\nError: {error}")
                line_index += 1

        # Write all pending closing braces
        close_pending_braces(pending_closing_braces, None, hierarchy_handle)
        hierarchy_handle.write("    }\n")
        write_taxonomic_classes(classes, class_handle, input_file)


if __name__ == "__main__":
    process_taxonomic_file(
        "dataset-308133.txtree",
        "taxonomic_hierarchy.py",
        "taxonomic_classes.py",
        "Domain:Eukaryota|Kingdom:Animalia|Phylum:Chordata|Class:Mammalia,Actinopterygii,Aves",
    )
