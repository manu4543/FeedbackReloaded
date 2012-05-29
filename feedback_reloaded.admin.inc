<?php

/**
 * Feedback Type UI Controller.
 */
class FeedbackRTypeUIController extends EntityDefaultUIController {

  /**
   * Overrides hook_menu() defaults.
   */
  public function hook_menu() {
    $items = parent::hook_menu();
    $items[$this->path]['description'] = 'Manage Feedback types, including fields.';
    return $items;
  }
}

/**
 * Generates the feedback type editing form.
 */
function feedback_reloaded_type_form($form, &$form_state, $feedback_reloaded_type, $op = 'edit') {

  if ($op == 'clone') {
    $feedback_reloaded_type->label .= ' (cloned)';
    $feedback_reloaded_type->type .= '_clone';
  }

  $form['label'] = array(
    '#title' => t('Label'),
    '#type' => 'textfield',
    '#default_value' => $feedback_reloaded_type->label,
    '#description' => t('The human-readable name of this feedback type.'),
    '#required' => TRUE,
    '#size' => 30,
  );
  
  // Machine-readable type name.
  $form['type'] = array(
    '#type' => 'machine_name',
    '#default_value' => isset($feedback_reloaded_type->type) ? $feedback_reloaded_type->type : '',
    '#machine_name' => array(
      'exists' => 'feedback_reloaded_get_types',
      'source' => array('label'),
    ),
    '#description' => t('A unique machine-readable name for this feedback type. It must only contain lowercase letters, numbers, and underscores.'),
  );
  
  $form['description'] = array(
    '#type' => 'textarea',
    '#default_value' => isset($feedback_reloaded_type->description) ? $feedback_reloaded_type->description : '',
    '#description' => t('Description about the feedback type.'),
  );
  
  $form['actions'] = array('#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save Feedback type'),
    '#weight' => 40,
  );
  return $form;
}

/**
 * Form API submit callback for the type form.
 */
function feedback_reloaded_type_form_submit(&$form, &$form_state) {
  $feedback_reloaded_type = entity_ui_form_submit_build_entity($form, $form_state);
  // Save and go back.
  $feedback_reloaded_type->save();
    drupal_set_message(t('Error saving Subscription type %label.', array('%label' => $feedback_reloaded_type->getTranslation('label'))), 'error');
  $form_state['redirect'] = 'admin/structure/feedbacks';
}