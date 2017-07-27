pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        parallel(
          "build": {
            echo 'Hello'
            sleep 5
            
          },
          "build2": {
            echo 'build2'
            
          }
        )
      }
    }
    stage('ci') {
      steps {
        parallel(
          "ci": {
            echo 'run ci'
            
          },
          "report": {
            echo 'report message'
            
          }
        )
      }
    }
    stage('deploy') {
      steps {
        archiveArtifacts(artifacts: '/dist', allowEmptyArchive: true)
      }
    }
  }
}