import { Progress } from "@nextui-org/react";


const LoadingProgress = () => {
    return (
        <div className='min-w-[500px]'>
            <Progress
                id='progress-buffering'
                size='sm'
                isIndeterminate
                aria-label='Loading...'
            />
        </div>
    );
}

export default LoadingProgress;