from django.core.validators import FileExtensionValidator
from django.db import models
from rest_framework.exceptions import ValidationError

from gestion_academica.models.pagos.TipoPago import TipoPago


class ComprobantePago(models.Model):
    tipo_pago = models.CharField(
        max_length=15,
        choices=TipoPago.choices,
        default=TipoPago.EFECTIVO,
    )

    tipo_archivo = models.FileField(
        upload_to="comprobantes/",
        validators=[FileExtensionValidator(allowed_extensions=["pdf", "png"])],
        blank=True,
        null=True,
    )
    monto = models.DecimalField(max_digits=8,decimal_places=2)
    fecha = models.DateField()

    numero_ref = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        unique=True,
    )

    class Meta:
        db_table = "comprobante_pago"
        verbose_name = "Comprobante de Pago"
        verbose_name_plural = "Comprobantes de Pago"

    def clean(self):
        if (
            self.tipo_pago == TipoPago.EFECTIVO
            and self.numero_ref
        ):
            raise ValidationError(
                "El pago en efectivo no tiene número de referencia."
            )

        if (
            self.tipo_pago == TipoPago.TRANSFERENCIA
            and not self.numero_ref
        ):
            raise ValidationError(
                "El pago con transferencia debe tener un número de referencia."
            )

        if (
            self.tipo_pago != TipoPago.EFECTIVO
            and not self.tipo_archivo
        ):
            raise ValidationError(
                "Debe adjuntar el comprobante de pago para este método de pago."
            )
    def __str__(self):
        return (
            f"{self.tipo_pago} - "
            f"{self.numero_ref} - "
            f"${self.monto} - "
            f"{self.fecha}"
        )