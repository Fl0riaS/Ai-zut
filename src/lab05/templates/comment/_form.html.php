<?php
/** @var $comment ?\App\Model\Comment */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="comment[subject]" value="<?= $comment ? $comment->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="comment[content]"><?= $comment? $comment->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
