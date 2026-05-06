useEffect(() => {
    let isMounted = true;

    const interval = setInterval(async () => {
        try {
            const current = await mockFetchAllIssues();

            if (!isMounted) return;

            setIssuesList(prev => {
                const same = JSON.stringify(prev) === JSON.stringify(current);
                return same ? prev : current;
            });

        } catch (err) {
            console.error(err);
        }
    }, 5000);

    return () => {
        isMounted = false;
        clearInterval(interval);
    };
}, []);