package com.harshank.klick;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Window;
import android.view.WindowManager;

/**
 * Created by Harshank Sananse on 12/1/2016.
 */
public class Splashscreen extends Activity {

    private final int SPLASH_DISPLAY_LENGTH = 3000;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.splashscreen);

        new Handler().postDelayed(new Runnable() {

            @Override
            public void run() {

                    Intent mainscreenIntent = new Intent(Splashscreen.this, MainActivity.class);
                    startActivity(mainscreenIntent);
                    Splashscreen.this.finish();

            }
        }, SPLASH_DISPLAY_LENGTH);
    }
}
