node {
	def app_name = "lottery-js"
	
	stage "Checkout"
	checkout scm

	stage "Checks"
	sshagent (credentials: ['dokku_admin']){
		sh "ssh -o StrictHostKeyChecking=no dokku@jug-montpellier.org apps"
	}
} 
