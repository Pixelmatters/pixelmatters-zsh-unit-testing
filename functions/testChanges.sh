function testchanges() {
    # Function to Run unit tests on all changed files

    STAGED_FILES=$(git status --porcelain | awk '{ print $2 }')
    TRIMMED_VUE=${STAGED_FILES//.vue/}
    TRIMMED_JS=${TRIMMED_VUE//.js/}
    TRIMMED_TS=${TRIMMED_JS//.ts/}
    TRIMMED_FILES=${TRIMMED_TS}

    NR_TRIMMED_FILES=`${TRIMMED_FILES.length}`
    if [ "$NR_TRIMMED_FILES" -lt "1" ]; then
        exit "Failed. You don't have any changed files"
    fi

    CHANGED_FILES_LIST=(`echo ${TRIMMED_FILES}`)

    if [ "$1" != "-u" ]
    then
        npx @testRunner ${CHANGED_FILES_LIST}
    else
        echo "Updating snapshots"
        npx @testRunner -u ${CHANGED_FILES_LIST}
    fi
}