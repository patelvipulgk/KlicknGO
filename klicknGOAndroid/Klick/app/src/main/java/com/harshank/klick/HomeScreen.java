package com.harshank.klick;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentStatePagerAdapter;
import android.support.v4.view.GravityCompat;
import android.support.v4.view.ViewPager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import java.util.ArrayList;
import java.util.List;
/**
 * Created by Harshank Sananse on 12/4/2016.
 */
public class HomeScreen extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    private Toolbar mToolbar;
    private DrawerLayout drawer;
    TabLayout tabLayout;
    ViewPager viewPager;
    Adapter adapter;
    public static final int ITEM_ONE = 0;
    public static final int ITEM_TWO = 1;
    public static final int ITEM_THREE = 2;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_screen);
        initToolbar();
        /****   drawer  ****/
        drawer = (DrawerLayout) findViewById(R.id.drawer_layout);

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

       // initToolbar();

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, mToolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();
        viewPager = (ViewPager)findViewById(R.id.viewpager);
        if (viewPager != null) {
            setupViewPager(viewPager);
        }
        tabLayout = (TabLayout)findViewById(R.id.tabs);
        tabLayout.setupWithViewPager(viewPager);



    }

    @Override
    public void onResume() {
        super.onResume();
        setupViewPager(viewPager);
    }

    private void setupViewPager(ViewPager viewPager) {
        adapter = new Adapter(getSupportFragmentManager());
        adapter.addFragment(new Fragment_message(), "Message");
        adapter.addFragment(new Fragment_contact(), "Contacts");
        viewPager.setAdapter(adapter);
        viewPager.setCurrentItem(0);
    }

    class Adapter extends FragmentStatePagerAdapter {
        private final List<Fragment> mFragments = new ArrayList<>();
        private final List<String> mFragmentTitles = new ArrayList<>();

        public Adapter(FragmentManager fm) {
            super(fm);
        }

        public void addFragment(Fragment fragment, String title) {
            mFragments.add(fragment);
            mFragmentTitles.add(title);
        }

        @Override
        public Fragment getItem(int position) {
            return mFragments.get(position);
        }

        @Override
        public int getCount() {
            return mFragments.size();
        }

        @Override
        public CharSequence getPageTitle(int position) {
            switch (position) {
                case ITEM_ONE:
                    return "Message";
                case ITEM_TWO:
                    return "Contacts";
            }
            return "Item One";
        }

    }

    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    private void initToolbar() {
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        TextView toolbar_title = (TextView) findViewById(R.id.toolbar_title);
        ImageView toolbar_back = (ImageView) findViewById(R.id.toolbar_back);
        getSupportActionBar().setTitle(null);
        //toolbar_title.setTypeface(GetFonts.getInstance().getRobotoFont(TravFeddHomeScreen.this));
        toolbar_back.setVisibility(View.GONE);
        toolbar_title.setText("Home");
    }
}
