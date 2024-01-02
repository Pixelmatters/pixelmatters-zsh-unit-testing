function testchanges() {
    # Function to Run unit tests on all changed files
    if CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD); then
        echo ""
    else
        echo ""
        echo "🚨 Failed."
        echo "> This path is not in a git repository."
        return 
    fi

    echo ""
    echo "👀 Detecting changed files in current branch…"
    echo "> (current branch) $CURRENT_BRANCH"

    STAGED_FILES=$(git status --porcelain | awk '{ print $2 }')
    TRIMMED_VUE=${STAGED_FILES//.vue/}
    TRIMMED_JS=${TRIMMED_VUE//.js/}
    TRIMMED_TS=${TRIMMED_JS//.ts/}
    TRIMMED_FILES=${TRIMMED_TS}

    NR_TRIMMED_FILES=`echo -n $TRIMMED_FILES | wc -m`
    if [ $NR_TRIMMED_FILES -lt 1 ]; then
        echo ""
        echo "🚨 Failed."
        echo "> You don't have any changed files yet."
        return
    fi

    CHANGED_FILES_LIST=(`echo ${TRIMMED_FILES}`)

    if [ "$1" != "-u" ]; then
        echo ""
        echo "⏲ Running unit tests…"
        echo ""
        @testRunner ${CHANGED_FILES_LIST}
    else
        echo ""
        echo "⏲ 📸 Running unit tests and updating snapshots…"
        echo ""
        @testRunner -u ${CHANGED_FILES_LIST}
    fi
}