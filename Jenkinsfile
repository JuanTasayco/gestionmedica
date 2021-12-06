#!groovy
@Library('global-pipeline-library')
@Library('pe-common-pipeline-config')

def DEVOPS_PLATFORM_ORGANIZATION = 'mapfreperu'

pipeline {
    agent {
        kubernetes {
            yaml getYmlBuildPod('node10')
        }
    }
    options {
        timeout(time: 25, unit: 'MINUTES')
        timestamps()
        parallelsAlwaysFailFast()
    }
    environment {
        // Current version
        PACKAGE_VERSION        = getFieldFromPackage("version")
        PACKAGE_NAME           = getFieldFromPackage("name")


        ACR_SERVER   = 'acrmapfredevops.azurecr.io'
        ACR_CRED_ID  = 'RegistryDevOpsPro'
    }
    stages {
        stage('Prepare Environment') {
            steps {
                initStageKPI()
                showEnvironment()
            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }
        stage('Prepare Promotion') {
            when {
                anyOf {
                    branch 'release/*'
                    branch 'master'
                    branch 'hotfix/*'
                }
            }
            steps {
                initStageKPI()
                container('node') {
                    promotionNpmPeru(env.BRANCH_NAME, env.PACKAGE_VERSION)
                }
            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }
        stage('Build & Unit Test') {
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")

            }            
            steps {
                initStageKPI()
                container('node') {
                    buildWithProfilesNpm(getBuildProfilePeru(BRANCH_NAME), PACKAGE_NAME,PACKAGE_VERSION, true)
                }                
            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }

        stage('Publish') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release/*'
                    branch 'master'
                    branch 'hotfix/*'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")
                credentialIdPublishNPM = 'app-jenkins-artifacts'
            }
            steps {
                initStageKPI()
                container('node') {
                    script() {
                        publishNPMPeru(env.PACKAGE_VERSION, credentialIdPublishNPM)
                    }
                }
            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }

        stage('Commit and Tag Promotion') {
            when {
                anyOf {
                    branch 'release/*'
                    branch 'master'
                    branch 'hotfix/*'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")

            }
            steps {
                initStageKPI()
                gitFetch('*')
                gitCheckout env.BRANCH_NAME

                script {
                    def msg = 'release'
                    if (BRANCH_NAME.startsWith('release/')) {
                        msg = 'release candidate'
                    } else if (BRANCH_NAME.startsWith('hotfix/')) {
                        msg = 'hotfix'
                    }                    
                    gitCommit  "promotion to " + msg + " completed (" + PACKAGE_VERSION + ")"
                    gitPush()
                    gitTag(PACKAGE_VERSION,  "New " + msg + " tag " + PACKAGE_VERSION)
                    gitPushTags()
                    
                }

            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }


        stage('Deploy to Frontal') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'release/*'
                    branch 'master'
                    branch 'hotfix/*'
                }
            }
            environment {
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")
                credentialIdPublishNPM = 'app-jenkins-artifacts'
            }
            steps {
                initStageKPI()
                retry(3) {
                    container('node') {
                        script() {
                            try {
                                packNPMPeru(env.PACKAGE_NAME,env.PACKAGE_VERSION, credentialIdPublishNPM)
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
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
            }
        }        

        stage('Next Snapshot Promotion') {
            when {
                branch 'release/*'
            }
            environment {
                developBranch = "develop"
                PACKAGE_VERSION        = getFieldFromPackage("version")
                PACKAGE_NAME           = getFieldFromPackage("name")
            }
            steps {
                initStageKPI()
                gitCheckout developBranch
                container('node') {
                    promotionNpmPeru(developBranch, env.PACKAGE_VERSION)
                }
                gitCommit "promotion to next SNAPSHOT completed (" + PACKAGE_VERSION  + ")"
                gitPush()
            }
            post {
                success {
                    successStageKPI()
                }
                failure {
                    failureStageKPI()
                }
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

