export default class CreateReferendum {
  constructor(referendumId, name, proposal, options, status) {
    this.referendumId = referendumId; 
    this.name = name; // mandatory
    this.proposal = proposal; // mandatory
    this.options = options; // mandatory
    this.status = 0; // created as 'ready' by default. 0 = 'Ready', 1 = 'Polls opened', 2 = 'Polls closed', 3 = 'Tallied'
  }
};