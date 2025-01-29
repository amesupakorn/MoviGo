 import "../styles/loading.css"

const Loading = () => {
    return (
        <div>
            <svg
            className="container"
            viewBox="0 0 40 40"
            height="40"
            width="40"
            >
            <circle 
                className="track"
                cx="20" 
                cy="20" 
                r="17.5" 
                pathLength="100" 
                stroke-width="5px" 
                fill="none" 
            />
            <circle 
                className="car"
                cx="20" 
                cy="20" 
                r="17.5" 
                pathLength="100" 
                stroke-width="5px" 
                fill="none" 
            />
            </svg>

        </div>
    )
}
export default Loading;