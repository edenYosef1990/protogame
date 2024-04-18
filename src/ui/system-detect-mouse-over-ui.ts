import { renderedUiProxyDef } from '../built-in-ecs-components';
import { createSystemWithQueries } from '../world/system/create-system-with-queries';
import { tryResetToIdleStateInSubtree } from './detect-and-handle-ui-interaction';

export const detectMouseOverUi = createSystemWithQueries(
  { entities: { renderUiComp: renderedUiProxyDef } },
  (_deps, queryResults) => {
    const snapshot = _deps.devicesInputModule.inputFromDevicesCollector.calculateInputSnapshot();
    let pos = snapshot.leftMouseKey.currentUiPosition;

    for (const { renderUiComp } of queryResults.entities) {
      tryResetToIdleStateInSubtree(renderUiComp.getNode());
    }
    if (snapshot.leftMouseKey.isThereClickEventUnconsumed) {
      for (const { renderUiComp } of queryResults.entities) {
        if (pos === null) return;
        let isClicked = renderUiComp.handleClick(pos);
        if (isClicked) {
          snapshot.leftMouseKey.isThereClickEventUnconsumed = false;
        }
      }
    } else {
      for (const { renderUiComp } of queryResults.entities) {
        if (pos === null) return;
        renderUiComp.handleHovering(pos);
      }
    }
  }
);
