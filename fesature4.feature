
@web @hu04
Feature: Historial y exportación
  Para analizar consumos pasados y compartir datos
  Como usuario de EcoLiving Web
  Quiero visualizar histórico y exportar CSV

  Background:
    Given el usuario ha iniciado sesión en la web
    And existen lecturas registradas para al menos un servicio

  Scenario: Visualizar histórico 7 y 30 días
    Given existen lecturas continuas de los últimos 30 días
    When el usuario selecciona el rango "7 días"
    Then el gráfico muestra 7 puntos y el promedio semanal
    When cambia el rango a "30 días"
    Then el gráfico muestra 30 puntos y el promedio mensual

  Scenario: Exportar CSV con filtros aplicados
    Given el usuario filtra por servicio "Agua" y rango "30 días"
    When pulsa "Exportar CSV"
    Then se descarga un archivo con columnas Fecha, Servicio, Unidad, Valor
    And los datos coinciden con el filtro aplicado

  Scenario: Estado sin datos
    Given no existen lecturas para el rango seleccionado
    When se carga la vista de histórico
    Then se muestra "Sin datos para este periodo"
    And se ofrecen "Limpiar filtros" y "Cambiar periodo"

  Scenario: Error de carga y reintento
    Given ocurre un fallo temporal del servicio
    When se intenta cargar el histórico
    Then se muestra un mensaje de error y el botón "Reintentar"
    When el usuario pulsa "Reintentar" y el servicio se restablece
    Then los datos se muestran correctamente

