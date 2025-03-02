from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

#Uses an ORM (Object RelationalMapping)- maps python objects to corresponding code that needs to be executed in the database
#JSON eqauals JavaScript Object Notation
#Serializers are used to convert complex data types, such as querysets and model instances, to native Python datatypes that can then be 
#easily rendered into JSON, XML or other content types.

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}  #Want to accept password but not return it
        #extra_kwargs is a dictionary that includes any additional keyword arguments that may be used to
        # override the default field instance that is used for a particular field type.
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) #** splits up the data into key value pairs
        return user #Once user is validated by the serializer, it is created and returned

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'author', 'created_at']
        extra_kwargs = {'author': {'read_only': True}} #should be able to read author but not write it (based on account/user)