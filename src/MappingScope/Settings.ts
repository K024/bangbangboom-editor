

export type Settings = {

  general: {

    song_volume: number
    effect_volume: number

    background_dim: number

  }

  editor: {

    autosave_interval: number
    // global

    keep_pitch: boolean

    // timing

    justify_find_nearest: boolean
    /** 1 | 2 | 3 | 4 | 6 | 8 | 16 | 48 */
    justify_grid_divisor: number

    show_info_window: boolean

    warn_for_same_pos_notes: boolean
  }

  game: {
    judge_offset: number
    visual_offset: number
    speed: number
    resolution: number
    note_scale: number
    bar_opaciry: number
    show_sim_line: boolean
    lane_effect: boolean
    mirror: boolean
    beat_note: boolean
  }
}

export const DefaultSettings: Settings = {
  general: { song_volume: 1, effect_volume: 1, background_dim: 0.7 },
  editor: {
    keep_pitch: false, justify_find_nearest: true, justify_grid_divisor: 48, show_info_window: true,
    warn_for_same_pos_notes: true, autosave_interval: 5,
  },
  game: {
    judge_offset: 0, visual_offset: 0, speed: 10, resolution: 1.25, note_scale: 1, bar_opaciry: 0.9,
    show_sim_line: true, lane_effect: true, mirror: false, beat_note: true,
  }
}