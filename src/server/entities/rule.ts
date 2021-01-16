import { RuleData } from '../interfaces';
import { Id } from '../utils';

export class RuleEntity {
  private ruleData: RuleData;

  constructor(data: RuleData) {
    this.validateData(data);
    this.ruleData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: RuleData): void {
    if (!data.name) throw new Error('A rule name must be provided.');
    if (!data.rule) throw new Error('A rule must be provided.');
    if (!data.severity) throw new Error('Rule severity must be provided.');
  }

  public data(): RuleData {
    return this.ruleData;
  }
}
