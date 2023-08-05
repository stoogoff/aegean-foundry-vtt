export function getItem(actorId, itemId) {
  const actor = game.actors.get(actorId);
  if (actor) {
    const item = actor.items.get(itemId);
    if (item) return item;
  }
  return false;
}

export async function itemCreate(actorId, itemBase) {
  const actor = game.actors.get(actorId);
  if (!actor) return false;
  return await Item.create(itemBase, {parent: actor});
}

export function itemEdit(actorId, itemId) {
  const item = getItem(actorId, itemId);
  if (item) item.sheet.render(true);
}

export function itemDelete(actorId, itemId) {
  const item = getItem(actorId, itemId);
  if (item) item.delete();
}