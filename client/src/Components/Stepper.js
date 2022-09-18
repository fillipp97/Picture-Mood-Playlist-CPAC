export default function Stepper({ steps, callback }) {

    return (
        <>
            <div style={{ background: "green" }}>
            {steps.map((step) => (
                <button key={step.name} disabled={!step.enabled} onClick={() => callback(step)}>{step.name}</button>
                ))}
            </div>
        </>
    )
}
