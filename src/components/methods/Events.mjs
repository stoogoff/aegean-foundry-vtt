export function onRollable(event, actorId = null) {
  event.preventDefault();
  const element = event.currentTarget ?? event.target;
  const dataset = element.dataset;
  const actor = actorId ? game.actors.get(actorId) : null;

  // Handle item rolls.
  if (dataset.rollType) {
    if (dataset.rollType == 'item' && actor) {
      const itemId = element.closest('.item').dataset.itemId;
      const item = actor.items.get(itemId);
      if (item) return item.roll();
    }
  }

  // Handle rolls that supply the formula directly.
  if (dataset.roll) {
    let label = dataset.label ? `[roll] ${dataset.label}` : '';
    let rollData = actor ? actor.getRollData() : {};
    let roll = new Roll(dataset.roll, rollData);
    roll.toMessage({
      speaker: actor ? ChatMessage.getSpeaker({ actor: actor }) : null,
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
  }
}