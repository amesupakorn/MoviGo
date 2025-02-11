export default function MovieSkeleton() {
    return (
        <div className="relative bg-gray-200 rounded-lg shadow-md overflow-hidden mx-auto w-full max-w-[250px] h-[450px] animate-pulse">
            <div className="w-full h-[300px] bg-gray-300"></div>
            <div className="p-4 flex flex-col justify-end flex-grow space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    );
}