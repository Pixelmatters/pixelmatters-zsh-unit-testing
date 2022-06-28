function testbranch() {
    # Function to Run unit tests on different files between two branches

    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    if [ $# -eq 1 ] && [ "$1" != "-u" ]; then
        BRANCH_TO_COMPARE=$1
    elif [ $# -eq 2 ] && [ "$1" = "-u" ] && [ "$2" != "" ]; then
        BRANCH_TO_COMPARE=$2
    else
        BRANCH_TO_COMPARE=@targetBranch
    fi

    echo "COMPARING FILES BETWEEN:"
    echo "$CURRENT_BRANCH (current branch) "
    echo "$BRANCH_TO_COMPARE (target branch) "

    CHANGED_FILES=$(git diff --name-status $BRANCH_TO_COMPARE | cut -f2)

    TRIMMED_VUE=${CHANGED_FILES//.vue/}
    TRIMMED_JS=${TRIMMED_VUE//.js/}
    TRIMMED_TS=${TRIMMED_JS//.ts/}
    TRIMMED_FILES=${TRIMMED_TS}


    NR_TRIMMED_FILES=`echo -n $TRIMMED_FILES | wc -m`
    if [ $NR_TRIMMED_FILES -lt 1 ]; then
        echo "🚨 Failed."
        echo "There are no changed files between $CURRENT_BRANCH and $BRANCH_TO_COMPARE"
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