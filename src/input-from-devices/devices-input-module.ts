import { InputFromDevicesCollector } from './input-from-devices-collector';
import { fabric } from 'fabric';

export class DevicesInputModule {
  inputFromDevicesCollector: InputFromDevicesCollector;
  transformation: any[];

  constructor(
    private worldCanvas: fabric.StaticCanvas,
    private canvas: fabric.Canvas
  ) {
    this.inputFromDevicesCollector = new InputFromDevicesCollector();
    this.transformation = fabric.util.invertTransform(
      this.worldCanvas.viewportTransform as any[]
    );

    this.canvas.on('mouse:down:before', this.handleMouseClick);
    this.canvas.on('mouse:move', this.handleMouseMove);

    window.addEventListener('keydown', this.handleKeyboardDownEvent);
    window.addEventListener('keyup', this.handleKeyboardUpEvent);
  }

  handleMouseMove = (mouseEvent: fabric.IEvent<MouseEvent>) => {
    const x = mouseEvent.pointer!.x;
    const y = mouseEvent.pointer!.y;

    let newPoint = fabric.util.transformPoint(
      new fabric.Point(x, y),
      this.transformation as any[]
    );
    this.inputFromDevicesCollector.collectLeftMouseState({
      currentPosition: { x: newPoint.x, y: newPoint.y },
      currentUiPosition: { x, y },
    });
  };

  handleMouseClick = () => {
    this.inputFromDevicesCollector.collectLeftMouseState({
      isDown: true,
      isThereClickEventUnconsumed: true,
    });
  };

  handleKeyboardDownEvent = (keyboardEvent: KeyboardEvent) => {
    this.inputFromDevicesCollector.collectKey(keyboardEvent.key, {
      isDown: true,
      isThereClickEventUnconsumed: true,
    });
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
  };

  handleKeyboardUpEvent = (keyboardEvent: KeyboardEvent) => {
    this.inputFromDevicesCollector.collectKey(keyboardEvent.key, {
      isDown: false,
    });
    keyboardEvent.preventDefault();
    keyboardEvent.stopPropagation();
  };
}
