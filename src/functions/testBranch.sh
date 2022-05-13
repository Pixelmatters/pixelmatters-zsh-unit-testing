function testbranch() {
    # Function to Run unit tests on different files between two branches

    if [ "$1" != "" ]
    then
        BRANCH_TO_COMPARE=$1
    else
        BRANCH_TO_COMPARE=@targetBranch
    fi

    CHANGED_FILES=$(git diff --name-status $BRANCH_TO_COMPARE | cut -f2)

    TRIMMED_VUE=${CHANGED_FILES//.vue/}
    TRIMMED_JS=${TRIMMED_VUE//.js/}
    TRIMMED_TS=${TRIMMED_JS//.ts/}
    TRIMMED_FILES=${TRIMMED_TS}


    NR_TRIMMED_FILES=`echo -n $TRIMMED_FILES | wc -m`
    if [ "$NR_TRIMMED_FILES" -lt "1" ]; then
        return "Failed. You don't have any changed files"
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