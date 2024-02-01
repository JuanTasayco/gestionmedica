#!groovy
import com.mapfre.pod.Container
import com.mapfre.pod.ContainerType
import com.mapfre.pod.ContainerTypeCustom
import com.mapfre.pod.ContainerSize
import com.mapfre.sonar.SonarScannerType

@Library(['global-pipeline-library', 'security_library','pe-common-pipeline-config']) _

def DEVOPS_PLATFORM_ORGANIZATION = 'org-mapfreperu'

def libModules = '.deploy/libModules.yml'

pipeline {
    agent {
        kubernetes {
            yaml getYmlBuildPod('node12')
        }
    }
    options {
        timeout(time: 25, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '30', artifactNumToKeepStr: '30'))
    }
    environment {
        // Current version
        PACKAGE_VERSION        = getFieldFromPackage("version")
        PACKAGE_NAME           = getFieldFromPackage("name")
    }
    stages {
        stage('Prepare Environment') {
            steps {
                prepareEnvironment()
            }
        }
        stage('Prepare sources') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                }
            }            
            steps {
                script() {
                    try {
                        exitCode = prepareSource(params.LISTABRANCHE)
                        if (exitCode != 0) {
                            error('Error in prepareSource: ' + exitCode)
                        }
                    } catch (Exception err) {
                        error('Error prepareSource : ' + err)
                    }
                }                
            }
        }         
        stage('Prepare Promotion') {
            when {
                anyOf {
                    branch 'master';branch 'develop'; branch 'hotfix/*'
                    expression {
                        return env.BRANCH_NAME.startsWith('release') 
                    }
                }
            }
            steps {
                container('node') {
                    promotionNpmPeru(env.BRANCH_NAME, env.PACKAGE_VERSION)
                }
            }
        }
        //This is a security stage that must be executed before building any code or image.
        stage('Security pre-build'){
            steps{
                script{
                    secPreBuild()
                }
            }
        }   

        stage('Build & Unit Test') {
            steps {
                container('node') {
                    buildWithProfilesNpm(getBuildProfilePeru(BRANCH_NAME))
                }                
            }
        }

        stage('SonarQube Analysis') {
            when {
                not {
                    branch 'PR*'
                }
            }      
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }                  
            steps {
                container('sonar'){
                     script {

                        def sonarConfig = getSonarConfiguration(PACKAGE_NAME)

                        if(sonarConfig.name==null) return

                        def sonarProyectoKey = getSonarProyectoKey(sonarConfig, env.BRANCH_NAME)
                        def sonarProyectName = getSonarProyectoName(sonarConfig, env.BRANCH_NAME)
                        def sonarExtraParameters = "-Dsonar.projectVersion=${PACKAGE_VERSION}"

                        sonarScanner(SONAR_ENVIRONMENT, sonarConfig.projectKey, sonarProyectoKey, sonarProyectName,
                             SonarScannerType.NPM,sonarExtraParameters)
                     }
                }
            }
        }       

        stage("Quality Gate"){
            when {
                not {
                    branch 'PR*'
                }
            }                 
           
            steps {

                container('sonar'){
                    script {
                        
                        def sonarConfig = getSonarConfiguration(PACKAGE_NAME)

                        if(sonarConfig.name==null) return

                        def sonarProyectoKey = getSonarProyectoKey(sonarConfig, env.BRANCH_NAME)

                        def status = checkQualityGatesPeru(SONAR_ENVIRONMENT,sonarConfig.projectKey,sonarProyectoKey)

                        if (status == "OK") {
                            println "Pasa el Quality Gates"
                        } else {
                            println "No pasa el quality Gates -> FAILED"
                            //error "Pipeline aborted due to quality gate failure: ${status}"
                        }
                        
                        
                    }
                }
            }
        }          

        stage('Publish') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            steps {
                container('node') {
                    script() {
                        publishNPMPeru()
                    }
                }
            }
        }

        stage('Commit and Tag Promotion') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            steps {
                gitFetch()
                gitIgnoreChange()
                gitCheckout env.BRANCH_NAME

                script {
                    def version = getFieldFromPackage("version")

                    def msg = 'release'
                    if (BRANCH_NAME.startsWith('release')) {
                        msg = 'release candidate'
                    }                
                    container('node') {
                        promotionNpmPeru(env.BRANCH_NAME, version)
                    }                    
                    gitCommitPackage  "promotion to " + msg + " completed (" + version + ")"
                    gitPush()
                    gitTag(version,  "New " + msg + " tag " + version)
                    gitPushTags()
                    
                }

            }

        }

        stage('Security post-build'){
            steps {
                script{
                    secPostBuild()
                }
            }
        }


        stage('Security pre-deploy'){
            steps{
                script{
                    secPreDeploy()
                }
            }
        }        

        stage('Deploy to Frontal') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release'
                    branch 'master'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")
            }
            steps {
                retry(3) {
                    container('node') {
                        script() {
                            try {
                                packNPMPeru(env.PACKAGE_NAME,env.PACKAGE_VERSION)
                                commandResult = deployCopyToFront(getProjectFromGit(GIT_URL),BRANCH_NAME, PACKAGE_NAME,PACKAGE_VERSION)
                                if (commandResult != 0) {
                                    error('ERROR EXITCODE deployCopyToFrontal: ' + commandResult)
                                }
                            } catch (Exception err) {
                                error('Error deploying to Frontal: ' + err)
                            }
                        }
                    }
                }                
            }
        }        

        stage('Security post-deploy'){
            steps{
                script{
                    secPostDeploy()
                }
            }
        }  

        stage ('Next Snapshot Promotion develop') {
            when {
				expression { return env.BRANCH_NAME == 'master' } 
            }
            environment {
                developBranch = "develop"
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }
            steps {
                // promotion to snapshot after a release candidate is packaged and deployed
                // git checkout development
                gitCheckout developBranch

                gitMergeWithResolveConflicts("master")

               sh "cat .deploy/Jenkinsfile.NoProd > Jenkinsfile"

                container('node') {
                    promotionNpmPeru(developBranch,PACKAGE_VERSION)
                }

                // commit next snapshot in development branch
                gitCommitPackage "promotion to next snapshot completed (" + PACKAGE_VERSION + ")"
                // push all changes
                gitPush()
            }

        }        

        stage ('Next Snapshot Promotion release') {
            when {
                expression { return env.BRANCH_NAME == 'master' } 
            }
            environment {
                developBranch = "release"
                PACKAGE_VERSION        = getFieldFromPackage("version")
            }
            steps {
                // promotion to snapshot after a release candidate is packaged and deployed
                // git checkout development
                gitCheckout developBranch

                gitMergeWithResolveConflicts("master")

                sh "cat .deploy/Jenkinsfile.NoProd > Jenkinsfile"

                container('node') {
                    promotionNpmPeru(developBranch,PACKAGE_VERSION)
                }

                // commit next snapshot in development branch
                gitCommitPackage "promotion to next snapshot completed (" + PACKAGE_VERSION + ")"
                // push all changes
                gitPush()
            }
        }
       
    }
    post {
        always {
            echo '--always--'
            logstashSend failBuild: false, maxLines: 150000
        }
        success {
            echo '--success--'
        }
        failure {
            echo '--failure--'
            script {
                GIT_COMMIT_EMAIL = getCommitEmail()
            }
            echo "DESTINATARIO ${GIT_COMMIT_EMAIL}"
            sendFailureEmail GIT_COMMIT_EMAIL
        }
    }
}

