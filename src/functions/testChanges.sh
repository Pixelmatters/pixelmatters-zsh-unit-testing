function testchanges() {
    # Function to Run unit tests on all changed files
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    echo "RUNNING UNIT TESTS FOR CHANGED FILES IN CURRENT BRANCH"
    echo "$CURRENT_BRANCH (current branch) "

    STAGED_FILES=$(git status --porcelain | awk '{ print $2 }')
    TRIMMED_VUE=${STAGED_FILES//.vue/}
    TRIMMED_JS=${TRIMMED_VUE//.js/}
    TRIMMED_TS=${TRIMMED_JS//.ts/}
    TRIMMED_FILES=${TRIMMED_TS}

    NR_TRIMMED_FILES=`echo -n $TRIMMED_FILES | wc -m`
    if [ $NR_TRIMMED_FILES -lt 1 ]; then
        echo "🚨 Failed."
        echo "You don't have any changed files yet."
        return
    fi

    CHANGED_FILES_LIST=(`echo ${TRIMMED_FILES}`)

    if [ "$1" != "-u" ]
    then
        @testRunner ${CHANGED_FILES_LIST}
    else
        echo "Updating snapshots"
        @testRunner -u ${CHANGED_FILES_LIST}
    fi
}