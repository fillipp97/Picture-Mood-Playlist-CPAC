import './Stepper.css'
export default function Stepper({ steps, callback }) {

    return (
        <>
            <div className="stepper">
            {steps.map((step) => (
                <button key={step.name} disabled={!step.enabled} onClick={() => callback(step)}>{step.name}</button>
                ))}
            </div>
        </>
    )
}
