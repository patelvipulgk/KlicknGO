package com.harshank.klick;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.widget.ImageView;

public class MainActivity extends AppCompatActivity {

    ImageView individualbtn,merchantbtn;
    private Toolbar mToolbar;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        individualbtn = (ImageView)findViewById(R.id.individualbtn);
        merchantbtn = (ImageView)findViewById(R.id.merchantbtn);
        individualbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent mainscreenIntent = new Intent(MainActivity.this, Individual_signup.class);
                startActivity(mainscreenIntent);

            }
        });
        merchantbtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent mainscreenIntent = new Intent(MainActivity.this, Merchant_signup.class);
                startActivity(mainscreenIntent);
            }
        });


    }
}
