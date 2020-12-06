const assert = require('assert');
import parseHTML from '../src/parser';

describe('parseHTML', function() {
  it('<a></a>', function () {
    let tree = parseHTML('<a href="http://www.baidu.com"></a>');
    assert.equal(tree.children[0].tagName, 'a');
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<span  class="test"  i d="app" ></span>', function () {
    let tree = parseHTML('<span  class=\'test\'  i d="app"></span>');
    assert.equal(tree.children[0].tagName, 'span');
    assert.equal(tree.children[0].attributes[0].value, 'test');
    assert.equal(tree.children[0].attributes[1].name, 'i');
    assert.equal(tree.children[0].children.length, 0);
  });
  it('<img/> selfClosingStartTag', function () {
    let tree = parseHTML('<img/>');
    assert.equal(tree.children[0].tagName, 'img');
  });
  it('<img />', function () {
    let tree = parseHTML('<img />');
    assert.equal(tree.children[0].tagName, 'img');
  });
  it('<img src="../sfdf"/>', function () {
    let tree = parseHTML('<img src="../sfdf"/>');
    assert.equal(tree.children[0].tagName, 'img');
  });
  
  it('<input class="test" disabled></input>', function () {
    let tree = parseHTML('<input class="test" disabled></input>');
    assert.equal(tree.children[0].tagName, 'input');
  });

  it('<style></style>', function () {
    let tree = parseHTML(`
    <style>#part.p{color: green;} span.test{ color: red; }div p{background: red;} #part{padding:10px;} .part{height: 100px;}</style>
    <div><span class="test">测试</span><p class="part"></p><p id="part" class="p"></p></div>`
    );
    assert.equal(tree.children.length, 4); // 包含了两次换行符
    assert.equal(tree.children[1].tagName, 'style');
    assert.equal(tree.children[3].tagName, 'div');
    assert.equal(tree.children[3].children.length, 3);
    assert.equal(tree.children[3].children[1].tagName, 'p');
  });
  
  // 不符合html规范的错误测试
  it('<p></span>', function () {
    try {
      parseHTML('<p></span>');
    } catch (err) {
      assert.equal(err, 'Error: Tag start end doesnit match!');
    }
  });
  it('<%></span>', function () {
    try {
      parseHTML('<%></span>');
    } catch (err) {
      assert.equal(err, 'Error: Tag is not exist!');
    }
  });
  it('<img34\ >', function () {
    try {
      parseHTML('<img34\ >');
    } catch (err) {
      assert.equal(err, 'Error: Tag is not exist!');
    }
  });
  it('<img /x>', function () {
    try {
      parseHTML('<img /x>');
    } catch (err) {
      assert.equal(err, 'Error: selfClosing Start Tag doesnit match!');
    }
  });
});