<?php

/**
 * @file
 * Feedback entity and controller classes.
 */

class FeedbackRController extends EntityAPIController {
}

class FeedbackRTypeController extends EntityAPIControllerExportable {
}



/**
 * FeedbackR class.
 */
class FeedbackR extends Entity {
  protected function defaultLabel() {
    return $this->title;
  }

  protected function defaultUri() {
    return array('path' => 'feedback/' . $this->identifier());
  }
}

/**
 * FeedbackRType class.
 */
class FeedbackRType extends Entity {
  public $type;
  public $label;
  public $weight = 0;

  public function __construct($values = array()) {
    parent::__construct($values, 'feedback_reloaded_type');
  }

}
