<?php
/**
 * Plugin Name: FreeJosef
 * Author: Rainer Schleevoigt
 * Version: 0.3
 * plugin uri: http://wordpress.org/extend/plugins/freejosef/
 * description: Dieses Plugin bindet die Solikarte ein. Wie geht das? In die Seite bindest Du folgenden Code ein: &lt;div id="josefmap" &gt;&lt;/div&gt;
 * author uri: http://hamburger-appwerft.de
 */


/**
 * FreeJosef ;)
 */

function hook_js() { 
	echo '<script type="text/javascript" src="../wp-content/plugins/freejosef/javascript/apiomat.js"></script>'."\n"
	. '<script type="text/javascript" src="../wp-content/plugins/freejosef/javascript/leaflet.js"></script>'."\n"
	. '<script type="text/javascript" src="../wp-content/plugins/freejosef/javascript/app.js"></script>'."\n"
	. '<link rel="stylesheet" href="http://leafletjs.com/dist/leaflet.css" />'."\n";
}
add_action('wp_head','hook_js');
?>