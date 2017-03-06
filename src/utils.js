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

/*
 * 递归object对象进行回调
 */
export const loopTree = (treeData, callback) => {
  treeData.forEach(item => {
    if (item.children && item.children.length) {
      loopTree(item.children, callback);
    }
    callback(item);
  });
};

/*
 * 递归节点进行回调
 */
export const loopTreeNodes = (treeNodes, callback) => {
  toArray(treeNodes).forEach(node => {
    const { props } = node;
    if (props.children && props.children.length) {
      loopTreeNodes(props.children, callback);
    }
    callback(node);
  });
};


/*
 * @params: options
 * @return: 渲染树
 */
export const loopTreeData = (data, level = 0) =>
  data.map((item, index) => {
    const pos = `${level}-${index}`;
    const props = {
      value: item.value,
      label: item.label || item.value,
      key: item.key || pos,
      pos,
      level: pos.split('-').length - 2,
      childrenLen: item.children && item.children.length || 0,
    };

    if (item.children && item.children.length) {
      props.children = loopTreeData(item.children, pos);
    }

    return props;
  });


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
export const filterDulpNodePos = (posArrs) => {
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

/*
 * @params: object{pos: node, ...}
 */
export const flatToHierarchy = (treeNodes) => {
  const posObj = {};
  const hierarchyNodes = [];
  Object.keys(treeNodes).forEach((pos) => {
    const len = pos.split('-').length;
    if (!posObj[len]) {
      posObj[len] = [];
    }
    posObj[len].push({ pos, node: treeNodes[pos] });
  });

  const posObjToKey = Object.keys(posObj).sort((a, b) => a < b);

  posObjToKey.reduce((pre, cur) => {
    posObj[pre].forEach((item) => {
      const { pos } = item;
      let haveParent = false;
      const parentPos = getParentPos(pos);
      posObj[cur].forEach((parentItem) => {
        if (haveParent) {
          return;
        } // 测试时间
        if (parentItem.pos === parentPos) {
          haveParent = true;
          if (!parentItem.children) {
            parentItem.children = [];
          }
          parentItem.children.push(item);
        }
      });

      if (!haveParent) {
        hierarchyNodes.push(item);
      }
    });

    return cur;
  });

  return posObj[posObjToKey[posObjToKey.length - 1]].concat(hierarchyNodes);
};

/*
 * @params: 渲染树、 被选中的values
 * @return: 被选中的节点、选中及半选节点的pos
 */
export const getTreeNodesStates = (treeData, vals) => {
  let checkedNodesPos = [];
  const treeNodesStates = {};
  const allPos = [];
  const halfCheckedNodes = [];
  const allPosBakForFilterHalf = []; // 用于筛选halfCheckNodes
  loopTree(treeData, (props) => {
    const { pos, value, label, childrenLen } = props;
    treeNodesStates[pos] = {
      pos, value, label,
      childrenLen,
    };
    allPos.push(pos);
    if (childrenLen !== 0) {
      allPosBakForFilterHalf.push(pos);
    }
    if (vals.indexOf(props.value) !== -1) {
      checkedNodesPos.push(pos);
    }
  });

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

  const checkedNodes = Object.keys(treeNodesStates).map((key) => {
    if (checkedNodesPos.indexOf(key) !== -1) {
      return treeNodesStates[key];
    }
    return null;
  }).filter(p => p);

  console.log(checkedNodesPos, halfCheckedNodes, checkedNodes);
  return {
    checkedNodes, checkedNodesPos, halfCheckedNodes,
  };
};
