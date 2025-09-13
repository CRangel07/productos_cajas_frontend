@echo off
setlocal

:: Crear nombre de archivo zip con fecha y hora
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMdd_HHmmss"') do set "timestamp=%%i"
set "outputFile=build_vue_%timestamp%.zip"

:: Verificar si la carpeta dist existe
if not exist "dist" (
    echo ❌ La carpeta 'dist' no existe. Ejecuta 'npm run build' primero.
    pause
    exit /b
)

:: Cambiar a carpeta dist temporalmente
pushd dist

:: Comprimir todo el contenido dentro de dist, pero el zip se guarda fuera de ella
powershell -NoProfile -Command "Compress-Archive -Path * -DestinationPath ../%outputFile%"

:: Regresar al directorio anterior
popd

:: Verificación final
if exist "%outputFile%" (
    echo ✅ ¡Comprimido exitosamente como %outputFile%!
) else (
    echo ❌ Error al crear el archivo zip.
)

pause
