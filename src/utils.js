import deepCopy from 'lodash/cloneDeep';

export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_CHILD = 'SHOW_CHILD';
export const SHOW_PARENT = 'SHOW_PARENT';

export const UNSELECTABLE_STYLE = {
  userSelect: 'none',
};

export const UNSELECTABLE_ATTRIBUTE = {
  unselectable: 'unselectable',
};

export function preventDefaultEvent(e) {
  e.preventDefault();
}

export const isArray = arr => Object.prototype.toString.call(arr) === '[object Array]';

export const toArray = (value) => {
  if (isArray(value)) {
    return value;
  } else if (value === undefined || value === null) {
    return [];
  }

  return [value];
};

const loopTree = (treeData, callback) => {
  treeData.forEach(item => {
    const props = item.props;
    if (props.children && props.children.length) {
      loopTree(props.children, callback);
    }
    callback(item, props);
  });
};

const isInherit = (parentPos, childPos) => {
  const parentPosArr = parentPos.split('-');
  const childPosArr = childPos.split('-');

  return parentPosArr.every((item, index) => item === childPosArr[index]);
};

const getParentPos = (childPos) => {
  const posArr = childPos.split('-');
  const len = posArr.length;
  return posArr.splice(len, 1).join('-');
};

/*
 * 去掉重复的pos
 * 输入['0-1', '0-1-1', '0-1-0']
 * 输出['0-1']
 */
const FilterDulpNodePos = (posArrs) => {
  const posObj = {};
  posArrs.forEach(pos => {
    const posArr = pos.split('-');
    const len = posArr.length;
    if (!posObj[len]) {
      posObj[len] = [];
    }
    posObj[len].push(pos);
  });
  const levelArr = Object.keys(posObj).sort();
  for (let i = 0; i < levelArr.length; i++) {
    if (posObj[levelArr[i + 1]]) {
      posObj[levelArr[i]].forEach((parentPos) => {
        for (let j = i + 1; j < levelArr.length; j++) {
          posObj[levelArr[j]].forEach((childPos, index) => {
            if (isInherit(parentPos, childPos)) {
              posObj[levelArr[j]][index] = null;
            }
          });
          posObj[levelArr[j]] = posObj[levelArr[j]].filter(p => p);
        }
      });
    }
  }

  const nPos = [].concat(...Object.keys(posObj).map(key => posObj[key]));

  return nPos;
};

const getCheck = (treeNodesStates, checkedNodesPos) => {
  Object.keys(treeNodesStates).forEach(key => {
    const targetNode = treeNodesStates[key];
    const { childrenCheckedNum, childrenLen } = targetNode;

    if (checkedNodesPos.indexOf(key) !== -1) {
      targetNode.checked = true;

      // 父节点childrenCheckedNum + 1 用于后面判断
      // 如果不存在则不会加
      const parentKey = getParentPos(key);
      if (treeNodesStates[parentKey]) {
        treeNodesStates[parentKey].childrenCheckedNum++;
      }
    } else if (childrenLen > 0 || childrenCheckedNum > 0) {
      if (childrenLen === childrenCheckedNum) {
        targetNode.checked = true;
      } else {
        targetNode.halfChecked = true;
      }
    }
  });
};

export const getTreeNodesStates = (treeData, vals) => {
  const checkedNodesPos = [];
  const treeNodesStates = {};
  loopTree(treeData, (node, props) => {
    const { pos, value, label } = props;
    treeNodesStates[pos] = {
      pos, value, label, node,
      checked: false,
      halfChecked: false,
    };
    if (vals.indexOf(props.value) !== -1) {
      checkedNodesPos.push(pos);
    }
  });

  console.log(treeNodesStates);

  // getCheck(treeNodesStates, checkedNodesPos);  


  return checkedNodes;
};
