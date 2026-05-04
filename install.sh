#!/bin/bash

echo "Instalando Aspersax API..."
echo

echo "Instalando dependencias del proyecto principal..."
npm install

echo
echo "Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo
echo "Instalando dependencias del backend..."
cd backend
pip install -r requirements.txt
cd ..

echo
echo "Configurando la base de datos..."
cd backend
python manage.py makemigrations
python manage.py migrate
echo
echo "Creando superusuario..."
python manage.py createsuperuser
cd ..

echo
echo "Instalacion completada!"
echo
echo "Para ejecutar el proyecto:"
echo "  npm run dev          - Ejecutar frontend y backend"
echo "  npm run dev:frontend - Solo frontend"
echo "  npm run dev:backend  - Solo backend"
echo
