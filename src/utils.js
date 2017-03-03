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

/*
 * 功能： 是否为上下级关系
 * isStrict 为 true，表示是绝对的父子关系
 */
const isInherit = (parentPos, childPos, isStrict = false) => {
  const parentPosArr = parentPos.split('-');
  const childPosArr = childPos.split('-');

  if (parentPosArr.length >= childPosArr.length) {
    return false;
  }

  return parentPosArr.every((item, index) => item === childPosArr[index]) &&
    (!isStrict || parentPosArr.length === childPosArr.length - 1);
};

const getParentPos = childPos => childPos.split('-').slice(0, -1).join('-');

/*
 * 去掉重复的pos
 * 输入['0-1', '0-1-1', '0-1-0']
 * 输出['0-1']
 */
const filterDulpNodePos = (posArrs) => {
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

// const getCheck = (treeNodesStates, checkedNodesPos) => {
//   Object.keys(treeNodesStates).forEach(key => {
//     const targetNode = treeNodesStates[key];
//     const { childrenCheckedNum, childrenLen } = targetNode;

//     if (checkedNodesPos.indexOf(key) !== -1) {
//       targetNode.checked = true;

//       // 父节点childrenCheckedNum + 1 用于后面判断
//       // 如果不存在则不会加
//       const parentKey = getParentPos(key);
//       if (treeNodesStates[parentKey]) {
//         treeNodesStates[parentKey].childrenCheckedNum++;
//       }
//     } else if (childrenLen > 0 || childrenCheckedNum > 0) {
//       if (childrenLen === childrenCheckedNum) {
//         targetNode.checked = true;
//       } else {
//         targetNode.halfChecked = true;
//       }
//     }
//   });
// };

export const getTreeNodesStates = (treeData, vals) => {
  let checkedNodesPos = [];
  const treeNodesStates = {};
  const checkedNodes = [];
  const allPos = [];
  const halfCheckedNodes = [];
  const allPosBakForFilterHalf = []; // 用于筛选halfCheckNodes
  loopTree(treeData, (node, props) => {
    const { pos, value, label, childrenLen } = props;
    treeNodesStates[pos] = {
      pos, value, label, node,
      childrenLen,
      checked: false,
      halfChecked: false,
    };
    allPos.push(pos);
    if (childrenLen !== 0) {
      allPosBakForFilterHalf.push(pos);
    }
    if (vals.indexOf(props.value) !== -1) {
      checkedNodesPos.push(pos);
      checkedNodes.push({ pos, value, label });
    }
  });

  console.log(treeNodesStates);
  const filterPos = filterDulpNodePos(checkedNodesPos);
  const halfCheckedNodesObj = {};
  // 去掉已经存在的点
  const allPosBak = allPos.filter(item => checkedNodesPos.indexOf(item) === -1);
  // 加入被选中的childNode
  filterPos.forEach(item => {
    for (let i = 0; i < allPosBak.length;) {
      const targetPos = allPosBak[i];
      if (isInherit(item, targetPos)) {
        checkedNodesPos.push(targetPos);
        allPosBak.splice(i, 1);
      } else {
        if (isInherit(targetPos, item, true)) {
          halfCheckedNodesObj[targetPos] = halfCheckedNodesObj[targetPos] ?
            halfCheckedNodesObj[targetPos] + 1 : 1;
        }
        i += 1;
      }
    }
  });
  // 加入被选中的parentNode
  // todo 优化
  const checkedNodesPosTmp = [];
  Object.keys(halfCheckedNodesObj).forEach((key) => {
    if (halfCheckedNodesObj[key] === treeNodesStates[key].childrenLen) {
      checkedNodesPosTmp.push(key);
    }
  });
  checkedNodesPos = checkedNodesPos.concat(checkedNodesPosTmp); // 合并
  function loop(newCheckedNodesPos) {
    const checkedNodesPosTmpInFunc = [];
    const beEffectPos = []; // 受影响的节点
    newCheckedNodesPos.forEach(key => {
      const parentPos = getParentPos(key);
      if (parentPos.split('-').length < 2) {
        return;
      }
      beEffectPos.push(parentPos);
      halfCheckedNodesObj[parentPos] = halfCheckedNodesObj[parentPos] ?
        halfCheckedNodesObj[parentPos] + 1 : 1;
    });

    beEffectPos.forEach((key) => {
      if (halfCheckedNodesObj[key] === treeNodesStates[key].childrenLen) {
        checkedNodesPosTmpInFunc.push(key);
      }
    });
    checkedNodesPos = checkedNodesPos.concat(checkedNodesPosTmpInFunc); // 合并

    if (checkedNodesPosTmpInFunc.length) {
      loop(checkedNodesPosTmpInFunc);
    }
  }

  loop(checkedNodesPosTmp);

  // 筛选halfcheckedNode
  filterPos.forEach(item => {
    for (let i = 0; i < allPosBakForFilterHalf.length;) {
      const targetPos = allPosBakForFilterHalf[i];
      if (isInherit(targetPos, item)) {
        halfCheckedNodes.push(targetPos);
        allPosBakForFilterHalf.splice(i, 1);
      } else {
        i += 1;
      }
    }
  });

  console.log(checkedNodesPos, halfCheckedNodes);


  // getCheck(treeNodesStates, checkedNodesPos);

  return Object.keys(treeNodesStates).map((key) => {
    if (checkedNodesPos.indexOf(key) !== -1) {
      return treeNodesStates[key];
    }
    return null;
  }).filter(p => p);
};
