import Skull from './Skull';
import Gun from './Gun';
import Chest from './Chest';
import '../styles/Stage.css';

export default function Stage({ stageRef, skullRef, gunRef, chestRef }) {
  return (
    <div ref={stageRef} className="stage" aria-live="polite">
      <div className="stage-bracket bracket-tl" />
      <div className="stage-bracket bracket-tr" />
      <div className="stage-bracket bracket-bl" />
      <div className="stage-bracket bracket-br" />
      <div className="stage-crosshair horizontal" />
      <div className="stage-crosshair vertical" />

      <div className="scene-wrap scene-skull">
        <Skull skullRef={skullRef} />
      </div>
      <div className="scene-wrap scene-gun">
        <Gun gunRef={gunRef} />
      </div>
      <div className="scene-wrap scene-chest">
        <Chest chestRef={chestRef} />
      </div>
    </div>
  );
}
