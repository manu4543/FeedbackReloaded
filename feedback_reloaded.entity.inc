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

  public function __construct($values = array()) {
    if (isset($values['type']) && is_object($values['type'])) {
      $values['type'] = $values['type']->name;
    }
    parent::__construct($values, 'feedback_reloaded');
  }
		
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
  public $name;
  public $label;
  public $weight = 0;

  public function __construct($values = array()) {
    parent::__construct($values, 'feedback_reloaded_type');
  }

}
