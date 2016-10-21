node {
	def app_name = "lottery-js"
	def repository_url = sh (script: "git config --get remote.origin.url", returnStdout: true).trim()
	
	sshagent (credentials: ['dokku_admin']){

		stage ("Deploy") {
			sh "ssh -o StrictHostKeyChecking=no dokku@jug-montpellier.org clone lottery-js ${repository_url}"	
		}
	}
} 
