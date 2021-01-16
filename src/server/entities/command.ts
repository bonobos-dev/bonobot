import { CommandData, CommandType, CommandArgumentType, CommandArgs } from '../interfaces';
import { Id } from '../utils';

export class CommandEntity {
  private commandData: CommandData;

  constructor(data: CommandData) {
    this.validateData(data);
    this.commandData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: CommandData): void {
    if (!data.name) throw new Error('A command name must be provided.');
    if (!data.prefix) throw new Error('A command prefix must be provided.');
    if (!data.type) throw new Error('A command type must be provided.');
    if (!CommandType[data.type]) throw new Error('Command type provided do not exist.');
    if (!data.description) throw new Error('A command description must be provided.');

    if (data.args.length > 0) {
      this.recursiveArgumentValidator(data.args);
    }

    if (!data.staticData) {
      data.staticData = {
        aviable: false,
        data: undefined,
      };
    }

    if (!data.dynamicData) {
      data.dynamicData = {
        aviable: false,
        data: undefined,
      };
    }
  }

  private recursiveArgumentValidator(argsArray: CommandArgs[]): void {
    if (argsArray.length > 0) {
      argsArray.forEach((arg) => {
        if (!arg.name) throw new Error('Args names must be provided.');
        if (!arg.prefix) throw new Error(`Argument prefix must be provided on argument ${arg.name}.`);
        if (!arg.type) throw new Error(`Argument type must be provided on argument ${arg.name}.`);
        if (!CommandArgumentType[arg.type]) throw new Error(`Argument type provided on argument ${arg.name} do not exist.`);
        if (!arg.description) throw new Error(`Argument descriptions must be provided on argument ${arg.name}.`);
        if (arg.args.length > 0) {
          this.recursiveArgumentValidator(arg.args);
        }
      });
    }
  }

  public data(): CommandData {
    return this.commandData;
  }
}
