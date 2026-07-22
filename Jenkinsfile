pipeline {
       agent any

       stages {
           stage('Clonar') {
               steps {
                   checkout scm
               }
           }
           stage('Instalar dependencias') {
               steps {
                   bat 'call npm install'
               }
           }
           stage('Build') {
               steps {
                   bat 'call npm run build'
               }
           }
       }
   }