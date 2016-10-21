node {
	def app_name = "lottery-js"
	
	stage "Checkout"
	checkout scm

	stage "Checks"
	ssh-agent(credentials: ['dokku_admin']){
		sh "ssh -o StrictHostKeyChecking=no -l dokku@jug-montpellier.org apps"
	}
} 
