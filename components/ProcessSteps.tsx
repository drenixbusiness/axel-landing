import { processSteps } from "@/lib/services";
import { Reveal } from "./Reveal";

export function ProcessSteps() {
  return (
    <Reveal as="ol" className="steps">
      {processSteps.map((s) => (
        <li className="card step" key={s.num} data-stagger>
          <span className="step__num">{s.num}</span>
          <h3 className="h3">{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </Reveal>
  );
}
