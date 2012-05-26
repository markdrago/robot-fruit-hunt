var item_values = {};

function new_game() {
    init_item_values();
}

function init_item_values() {
    var item_count = {};
    var item_count_total = 0;
    for (var i = 1; i <= get_number_of_item_types(); i++) {
        item_count[i] = get_total_item_count(i);
        item_count_total = item_count_total + item_count[i];
    }

    for (var i = 1; i <= get_number_of_item_types(); i++) {
        item_values[i] = 1 / (item_count[i] / item_count_total);
    }
}

function get_highest_valued_type_still_on_board() {
    var highest_valued_type = 0;
    var highest_value = 0;
    for (var i = 1; i <= get_number_of_item_types(); i++) {
        var pieces_consumed_of_type = get_my_item_count(i) + get_opponent_item_count(i);
        var pieces_remaining_of_type = get_total_item_count(i) - pieces_consumed_of_type;
        var pieces_of_type_needed_to_win = (get_total_item_count(i) + .5) / 2;
        if (get_my_item_count(i) < pieces_of_type_needed_to_win &&
            get_my_item_count(i) + pieces_remaining_of_type > pieces_of_type_needed_to_win) {
            if (item_values[i] > highest_value) {
                highest_valued_type = i;
                highest_value = item_values[i];
            }
        }
    }
    return highest_valued_type;
}

function get_closest_square_with_item_of_type(itemtype) {
    var all_of_type = get_all_squares_with_item_of_type(itemtype);
    var myx = get_my_x();
    var myy = get_my_y();

    var minscore = -1;
    var closest_position;
    for (var i in all_of_type) {
        var possible = all_of_type[i];
        var distance = Math.abs(myx - possible.x) + Math.abs(myy - possible.y);
        if (minscore == -1 || distance < minscore) {
            minscore = distance;
            closest_position = possible;
        }
    }

    return closest_position;
}

function make_decision_to_move_towards_target(position) {
    var board = get_board();
    var myx = get_my_x();
    var myy = get_my_y();

    if (has_item(board[myx][myy])) {
        return TAKE;
    }

    if (myx < position.x) {
        return EAST;
    } else if (myx > position.x) {
        return WEST;
    } else if (myy < position.y) {
        return SOUTH;
    } else if (myy > position.y) {
        return NORTH;
    }
}

function get_all_squares_with_item_of_type(itemtype) {
    var board = get_board();
    var results = [];
    for (var x = 0; x < WIDTH; x++) {
        for (var y = 0; y < HEIGHT; y++) {
            if (board[x][y] == itemtype) {
                var pos = {'x': x, 'y': y};
                results.push(pos);
            }
        }
    }

    return results;
}

function make_move() {
    var target_type = get_highest_valued_type_still_on_board();
    trace("going for type: " + target_type);
    var target = get_closest_square_with_item_of_type(target_type);
    trace("going to position: (" + target.x + ", " + target.y + ")");
    return make_decision_to_move_towards_target(target);
}
