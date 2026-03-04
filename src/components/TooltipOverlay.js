import "./TooltipOverlay.scss";

const TooltipOverlay = ({ text }) => {
    return (
        <div className="TooltipOverlay">
            <p>{text}</p>
        </div>
    );
}

export default TooltipOverlay;