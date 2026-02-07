import { useTypedSelector } from 'app/hooks/useTypedSelector';
import { useWorkspaceState } from 'app/hooks/useWorkspaceState';
import store from 'app/store';

const Info = () => {
    const {
        toolSet,
        movementSet,
        spindleSet,
        estimatedTime,
        fileModal,
        currentToolpath,
        toolpathComments,
    } = useTypedSelector((state) => state.file);
    const { units } = useWorkspaceState();

    // Get showCurrentOperation setting
    const showCurrentOperation = store.get(
        'workspace.commentDisplay.showCurrentOperation',
        true,
    );

    const toolSetFormatted = toolSet.map((tool) => tool.replace('T', ''));
    const movementSetFormatted = movementSet
        .map((spindle) => Number(spindle.replace('F', '')))
        .sort();
    const spindleSetFormatted = spindleSet.map((spindle) =>
        Number(spindle.replace('S', '')),
    );

    // Convert feedrate values based on fileModal and preferred units
    const convertFeedrate = (feedrate: number): number => {
        const isFileInInches = fileModal?.includes('G20');
        const isFileInMm = fileModal?.includes('G21');
        const userPrefersInches = units === 'in';
        const userPrefersMm = units === 'mm';

        if (isFileInInches && userPrefersMm) {
            return feedrate * 25.4;
        }

        if (isFileInMm && userPrefersInches) {
            return feedrate / 25.4;
        }

        return feedrate;
    };

    const formatNumber = (num: number): string => {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toFixed(2).replace(/\.?0+$/, '');
    };

    const convertedFeedrates = movementSetFormatted.map(convertFeedrate);
    const feedrateMin = Math.min(...convertedFeedrates);
    const feedrateMax = Math.max(...convertedFeedrates);
    const spindleMin = Math.min(...spindleSetFormatted);
    const spindleMax = Math.max(...spindleSetFormatted);

    const formatEstimatedTime = (seconds: number): string => {
        if (seconds < 60) {
            return `${Math.ceil(seconds)}s`;
        }

        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}m ${Math.ceil(remainingSeconds)}s`;
        }

        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${remainingMinutes}m`;
    };

    const formattedEstimatedTime = formatEstimatedTime(estimatedTime);

    const formattedFeedrate =
        feedrateMin === feedrateMax
            ? `${formatNumber(feedrateMin)} ${units === 'mm' ? 'mm/min' : 'in/min'}`
            : `${formatNumber(feedrateMin)}-${formatNumber(feedrateMax)} ${units === 'mm' ? 'mm/min' : 'in/min'}`;

    // Determine if we should show the current operation display
    const hasToolpathComments = toolpathComments && toolpathComments.length > 0;
    const shouldShowOperation =
        showCurrentOperation && hasToolpathComments && currentToolpath;

    return (
        <div className="text-gray-900 dark:text-gray-300">
            {shouldShowOperation && (
                <div className="flex gap-1">
                    <span className="font-bold">Operation</span>
                    <span className="truncate max-w-[180px]" title={currentToolpath}>
                        {currentToolpath}
                    </span>
                </div>
            )}

            <div className="flex gap-1">
                <span className="font-bold">Estimated Time</span>
                <span>{formattedEstimatedTime}</span>
            </div>

            <div className="flex gap-1">
                <span className="font-bold">Feed</span>
                <span>{formattedFeedrate}</span>
            </div>

            <div className="flex gap-1">
                <span className="font-bold">Speed</span>
                <span>
                    {spindleSetFormatted.length === 0
                        ? 'None'
                        : `${spindleMin}-${spindleMax} RPM`}
                </span>
            </div>

            <div className="flex gap-1">
                <span className="font-bold">Tools</span>
                <span>
                    {toolSetFormatted.length === 0
                        ? 'None'
                        : `${toolSetFormatted.length} (${toolSetFormatted.toString()})`}
                </span>
            </div>
        </div>
    );
};

export default Info;
