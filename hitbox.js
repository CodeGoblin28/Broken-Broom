export function checkBoxCollision(a, b){

    const aLeft   = a.x + (a.hitbox?.offsetX || 0);
    const aTop    = a.y + (a.hitbox?.offsetY || 0);
    const aRight  = aLeft + (a.hitbox?.width || a.width);
    const aBottom = aTop + (a.hitbox?.height || a.height);

    const bLeft   = b.x + (b.hitbox?.offsetX || 0);
    const bTop    = b.y + (b.hitbox?.offsetY || 0);
    const bRight  = bLeft + (b.hitbox?.width || b.width);
    const bBottom = bTop + (b.hitbox?.height || b.height);

    return (
        aLeft < bRight &&
        aRight > bLeft &&
        aTop < bBottom &&
        aBottom > bTop
    );
}