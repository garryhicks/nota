/* eslint-env mocha */
import errors from '../src/domain/Errors';
import Referendum from '../src/domain/Referendum';
import ReferendumCreated from '../src/events/ReferendumCreated';
import OpenPolls from '../src/commands/OpenPolls';
import PollsOpened from '../src/events/PollsOpened';
import assert from 'assert';

describe('polls', function() {
  describe('When a Referendum is created', function() {
    var referendum = new Referendum();
    var options = ["Remain a member of European Union", "Leave the European Union"];
    debugger;
    referendum.hydrate(new ReferendumCreated("134","Referendum on the United Kindom's membership of the European Union", "Should the United Kindom remain a member of the European Union?", options, 0));

    it('then it should not be opened yet', function() {
      assert.equal(referendum._status, 0)
    })

    it('then it should open when OpenPolls is called', function() {
      var results = referendum.execute(new OpenPolls("134"));
      assert.equal(referendum._status, 0);
      assert.equal(results.length, 1);
      assert.ok(results[0] instanceof PollsOpened);
      assert.equal(results[0].referendumId, "134");

      results.forEach(e => referendum.hydrate(e));
      assert.equal(referendum._status, 1);
    })
  })

});