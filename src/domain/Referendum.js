import CreateReferendum from '../commands/CreateReferendum';
import ReferendumCreated from '../events/ReferendumCreated';
import OpenPolls from '../commands/OpenPolls';
import PollsOpened from '../events/PollsOpened';
import errors from '../domain/Errors';

export default class Referendum {
  constructor() {
    this._id = null;
  }

  hydrate(evt) {
    if (evt instanceof ReferendumCreated) return this._onReferendumCreated(evt);
    if (evt instanceof PollsOpened) return this._onPollsOpened(evt);
  }

  _onReferendumCreated(evt) {
    this._id = evt.referendumId;
    this._status = evt.status;
  }

  _onPollsOpened(evt) {
    this._status = 1;
  }

  execute(command) {
    if (command instanceof CreateReferendum) return this._CreateReferendum(command);
    if (command instanceof OpenPolls) return this._OpenPolls(command);
    throw new Error('Unknown command.');
  }

  _CreateReferendum(command) {
    var validationErrors = [];
    if(this._id) {
      validationErrors.push({"field": "", "msg": "Referendum already exists."})
    }
    if(!command.referendumId) {
      validationErrors.push({"field": "referendumId", "msg": "Referendum id is a required field."});
    }
    if(!command.proposal) {
      validationErrors.push({"field": "proposal", "msg": "Referendum proposal is a required field."});
    }   
    if(!command.name) {
      validationErrors.push({"field": "name", "msg": "Referendum name is a required field."});
    }   
    if(!command.options) {
      validationErrors.push({"field": "options", "msg": "Referendum options are required."});
    }
    if(command.options&&command.options.length < 2) {
      validationErrors.push({"field": "options", "msg": "At least two options are required."});
    }
    if(typeof command.status === 'undefined') {
      throw new errors.ValidationFailed("Referendum must be created with a status.");
    }
    if(command.status !== 0) {
      throw new errors.ValidationFailed("Referendum status upon creation must be 0.");
    }
    if(validationErrors.length > 0) {
      throw new errors.ValidationFailed(validationErrors);
    }  
    command.options.push("None of the above");
    var result = [];
    result.push(new ReferendumCreated(command.referendumId, command.name, command.proposal, command.options, command.status));
    return result;
  }

  _OpenPolls(command) {
    var validationErrors = [];
    if (command.status !== 0) {
      validationErrors.push({"field": "", "msg": "Poll already opened/commenced."})
    }
    var result = [];
    result.push(new PollsOpened(command.referendumId));
    return result;
  }
}
