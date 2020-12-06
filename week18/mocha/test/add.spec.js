const assert = require('assert');
import { add, multi } from '../utils/add';
// const { add } = require('../utils/add');

describe('add function unit test', function() {
  it('1 plus 2 should 3', function() {
    assert.equal(add(1, 2), 3);
  });
  it('-2 plus 2 should 0', function() {
    assert.equal(add(-2, 2), 0);
  });
  it('-2 plus 2 should 4', function() {
    assert.equal(multi(-2, 2), -4);
  });
});