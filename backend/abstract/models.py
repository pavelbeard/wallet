import nanoid_field

from django.db import models
from abstract import managers


# Create your models here.


class AbstractModel(models.Model):
    public_id = nanoid_field.NanoidField(db_index=True, max_length=16, unique=True, editable=False, serialize=False)

    objects = managers.AbstractManager()

    class Meta:
        abstract = True
